// This is a modified Threejs file: https://github.com/mrdoob/three.js/blob/dev/examples/jsm/controls/OrbitControls.js
// It helps keep the imports simple.

import {
  EventDispatcher,
  MOUSE,
  Quaternion,
  Spherical,
  TOUCH,
  Vector2,
  Vector3,
  PerspectiveCamera,
} from 'three';

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends EventDispatcher {
  domElement: HTMLElement;

  object: PerspectiveCamera;

  enabled: boolean = true;

  target: Vector3 = new Vector3(0, 0, 0);

  minPolarAngle: number = Math.PI / 3;

  maxPolarAngle: number = (2 * Math.PI) / 3;

  minAzimuthAngle: number = -Math.PI / 2;

  maxAzimuthAngle: number = Math.PI / 2;

  enableDamping: boolean = true;

  dampingFactor: number = 0.05;

  enableRotate: boolean = true;

  rotateSpeed: number = 1.0;

  enablePan: boolean = false;

  panSpeed: number = 1.0;

  screenSpacePanning: boolean = true;

  mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE } = {
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN,
  };

  touches: { ONE: TOUCH; TWO: TOUCH } = {
    ONE: TOUCH.ROTATE,
    TWO: TOUCH.DOLLY_PAN,
  };

  target0: Vector3 = this.target.clone();

  position0: Vector3;

  getPolarAngle: () => number;

  getAzimuthalAngle: () => number;

  getDistance: () => number;

  saveState: () => void;

  reset: () => void;

  dispose: () => void;

  constructor(object: PerspectiveCamera, domElement: HTMLElement) {
    super();
    this.object = object;
    this.domElement = domElement;
    this.domElement.style.touchAction = 'none';
    this.position0 = this.object.position.clone();

    const scope = this;

    const STATE = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6,
    };

    // current position in spherical coordinates
    const spherical = new Spherical();
    const sphericalDelta = new Spherical();

    const rotateStart = new Vector2();
    const rotateEnd = new Vector2();
    const rotateDelta = new Vector2();

    const pointers: any[] = [];
    const pointerPositions: any[] = [];

    let state = STATE.NONE;

    this.getPolarAngle = () => spherical.phi;

    this.getAzimuthalAngle = () => spherical.theta;

    this.getDistance = () => this.object.position.distanceTo(this.target);

    this.saveState = () => {
      scope.target0.copy(scope.target);
      scope.position0.copy(scope.object.position);
    };

    this.reset = () => {
      scope.target.copy(scope.target0);
      scope.object.position.copy(scope.position0);

      scope.object.updateProjectionMatrix();
      scope.dispatchEvent(_changeEvent);

      scope.update();

      state = STATE.NONE;
    };

    // this method is exposed, but perhaps it would be better if we can make it private...
    this.update = (() => {
      const offset = new Vector3();

      // so camera.up is the orbit axis
      const quat = new Quaternion().setFromUnitVectors(
        object.up,
        new Vector3(0, 1, 0)
      );
      const quatInverse = quat.clone().invert();

      const twoPI = 2 * Math.PI;

      return function update() {
        const { position } = scope.object;

        offset.copy(position).sub(scope.target);

        // rotate offset to "y-axis-is-up" space
        offset.applyQuaternion(quat);

        // angle from z-axis around y-axis
        spherical.setFromVector3(offset);

        if (scope.enableDamping) {
          spherical.theta += sphericalDelta.theta * scope.dampingFactor;
          spherical.phi += sphericalDelta.phi * scope.dampingFactor;
        } else {
          spherical.theta += sphericalDelta.theta;
          spherical.phi += sphericalDelta.phi;
        }

        // restrict theta to be between desired limits
        let min = scope.minAzimuthAngle;
        let max = scope.maxAzimuthAngle;

        if (Number.isFinite(min) && Number.isFinite(max)) {
          if (min < -Math.PI) min += twoPI;
          else if (min > Math.PI) min -= twoPI;

          if (max < -Math.PI) max += twoPI;
          else if (max > Math.PI) max -= twoPI;

          if (min <= max) {
            spherical.theta = Math.max(min, Math.min(max, spherical.theta));
          } else {
            spherical.theta =
              spherical.theta > (min + max) / 2
                ? Math.max(min, spherical.theta)
                : Math.min(max, spherical.theta);
          }
        }

        // restrict phi to be between desired limits
        spherical.phi = Math.max(
          scope.minPolarAngle,
          Math.min(scope.maxPolarAngle, spherical.phi)
        );

        spherical.makeSafe();

        offset.setFromSpherical(spherical);

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion(quatInverse);

        position.copy(scope.target).add(offset);

        scope.object.lookAt(scope.target);

        if (scope.enableDamping === true) {
          sphericalDelta.theta *= 1 - scope.dampingFactor;
          sphericalDelta.phi *= 1 - scope.dampingFactor;
        } else {
          sphericalDelta.set(0, 0, 0);
        }

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        return false;
      };
    })();
    function addPointer(event: any) {
      pointers.push(event);
    }
    function trackPointer(event: PointerEvent) {
      let position = pointerPositions[event.pointerId];

      if (position === undefined) {
        position = new Vector2();
        pointerPositions[event.pointerId] = position;
      }

      position.set(event.pageX, event.pageY);
    }
    function getSecondPointerPosition(event: { pointerId: any }) {
      const pointer =
        event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];

      return pointerPositions[pointer.pointerId];
    }
    function rotateLeft(angle: number) {
      sphericalDelta.theta -= angle;
    }

    function rotateUp(angle: number) {
      sphericalDelta.phi -= angle;
    }
    function handleTouchMoveRotate(event: PointerEvent) {
      if (pointers.length === 1) {
        rotateEnd.set(event.pageX, event.pageY);
      } else {
        const position = getSecondPointerPosition(event);

        const x = 0.5 * (event.pageX + position.x);
        const y = 0.5 * (event.pageY + position.y);

        rotateEnd.set(x, y);
      }

      rotateDelta
        .subVectors(rotateEnd, rotateStart)
        .multiplyScalar(scope.rotateSpeed);

      const element = scope.domElement;

      rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height

      rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);

      rotateStart.copy(rotateEnd);
    }
    function onTouchMove(event: any) {
      trackPointer(event);
      handleTouchMoveRotate(event);
      scope.update();
    }
    function handleMouseMoveRotate(event: {
      clientX: number;
      clientY: number;
    }) {
      rotateEnd.set(event.clientX, event.clientY);

      rotateDelta
        .subVectors(rotateEnd, rotateStart)
        .multiplyScalar(scope.rotateSpeed);

      const element = scope.domElement;

      rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height

      rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);

      rotateStart.copy(rotateEnd);

      scope.update();
    }
    function onMouseMove(event: any) {
      if (scope.enabled === false) return;

      if (scope.enableRotate === false) return;

      handleMouseMoveRotate(event);
    }
    function onPointerMove(event: { pointerType: string }) {
      if (scope.enabled === false) return;

      if (event.pointerType === 'touch') {
        onTouchMove(event);
      } else {
        onMouseMove(event);
      }
    }
    function removePointer(event: PointerEvent) {
      delete pointerPositions[event.pointerId];

      for (let i = 0; i < pointers.length; i += 1) {
        if (pointers[i].pointerId === event.pointerId) {
          pointers.splice(i, 1);
          return;
        }
      }
    }
    function onPointerUp(event: PointerEvent) {
      removePointer(event);

      if (pointers.length === 0) {
        scope.domElement.releasePointerCapture(event.pointerId);

        scope.domElement.removeEventListener('pointermove', onPointerMove);
        scope.domElement.removeEventListener('pointerup', onPointerUp);
      }

      scope.dispatchEvent(_endEvent);

      state = STATE.NONE;
    }
    function handleTouchStartRotate() {
      if (pointers.length === 1) {
        rotateStart.set(pointers[0].pageX, pointers[0].pageY);
      } else {
        const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
        const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);

        rotateStart.set(x, y);
      }
    }
    function onTouchStart(event: any) {
      trackPointer(event);

      if (scope.enableRotate === false) return;

      handleTouchStartRotate();

      state = STATE.TOUCH_ROTATE;

      if (state !== STATE.NONE) {
        scope.dispatchEvent(_startEvent);
      }
    }
    function handleMouseDownRotate(event: {
      clientX: number;
      clientY: number;
    }) {
      rotateStart.set(event.clientX, event.clientY);
    }
    function onMouseDown(event: MouseEvent) {
      if (scope.enableRotate === false) return;

      handleMouseDownRotate(event);

      state = STATE.ROTATE;

      if (state !== STATE.NONE) {
        scope.dispatchEvent(_startEvent);
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (scope.enabled === false) return;

      if (pointers.length === 0) {
        scope.domElement.setPointerCapture(event.pointerId);

        scope.domElement.addEventListener('pointermove', onPointerMove);
        scope.domElement.addEventListener('pointerup', onPointerUp);
      }

      addPointer(event);

      if (event.pointerType === 'touch') {
        onTouchStart(event);
      } else {
        onMouseDown(event);
      }
    }
    function onPointerCancel(event: any) {
      removePointer(event);
    }
    this.dispose = () => {
      scope.domElement.removeEventListener('pointerdown', onPointerDown);
      scope.domElement.removeEventListener('pointercancel', onPointerCancel);

      scope.domElement.removeEventListener('pointermove', onPointerMove);
      scope.domElement.removeEventListener('pointerup', onPointerUp);
    };

    scope.domElement.addEventListener('pointerdown', onPointerDown);
    scope.domElement.addEventListener('pointercancel', onPointerCancel);

    this.update();
  }

  update() {
    throw new Error('Method not implemented.');
  }
}

export { OrbitControls };
