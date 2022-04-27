// This is a lightly modified Threejs file. It helps keep the imports simple.
/* eslint-disable default-case */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */

import {
  EventDispatcher,
  MOUSE,
  Quaternion,
  Spherical,
  TOUCH,
  Vector2,
  Vector3,
  Matrix4,
  PerspectiveCamera,
} from 'three';

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends EventDispatcher {
  domElement: HTMLElement;

  object: PerspectiveCamera;

  enabled: boolean = true;

  target: Vector3 = new Vector3();

  minPolarAngle: number = 0;

  maxPolarAngle: number = Math.PI;

  minAzimuthAngle: number = -Infinity;

  maxAzimuthAngle: number = Infinity;

  enableDamping: boolean = false;

  dampingFactor: number = 0.05;

  enableRotate: boolean = true;

  rotateSpeed: number = 1.0;

  enablePan: boolean = true;

  panSpeed: number = 1.0;

  screenSpacePanning: boolean = true;

  keyPanSpeed: number = 7.0;

  autoRotate: boolean = false;

  autoRotateSpeed: number = 2.0;

  keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string } = {
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    BOTTOM: 'ArrowDown',
  };

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

  _domElementKeyEvents: EventTarget | null;

  getPolarAngle: () => number;

  getAzimuthalAngle: () => number;

  getDistance: () => number;

  listenToKeyEvents: (domElement: any) => void;

  saveState: () => void;

  reset: () => void;

  dispose: () => void;

  constructor(object: PerspectiveCamera, domElement: HTMLElement) {
    super();
    this.object = object;
    this.domElement = domElement;
    this.domElement.style.touchAction = 'none';
    this.position0 = this.object.position.clone();

    this._domElementKeyEvents = null;

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

    const panOffset = new Vector3();

    const rotateStart = new Vector2();
    const rotateEnd = new Vector2();
    const rotateDelta = new Vector2();

    const panStart = new Vector2();
    const panEnd = new Vector2();
    const panDelta = new Vector2();

    const pointers: any[] = [];
    const pointerPositions: any[] = [];

    let state = STATE.NONE;

    this.getPolarAngle = () => spherical.phi;

    this.getAzimuthalAngle = () => spherical.theta;

    this.getDistance = () => this.object.position.distanceTo(this.target);

    this.listenToKeyEvents = domE => {
      domE.addEventListener('keydown', onKeyDown);
      this._domElementKeyEvents = domE;
    };

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

        if (scope.autoRotate && state === STATE.NONE) {
          rotateLeft(getAutoRotationAngle());
        }

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

        if (isFinite(min) && isFinite(max)) {
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

        spherical.radius *= scale;

        // move target to panned location

        if (scope.enableDamping === true) {
          scope.target.addScaledVector(panOffset, scope.dampingFactor);
        } else {
          scope.target.add(panOffset);
        }

        offset.setFromSpherical(spherical);

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion(quatInverse);

        position.copy(scope.target).add(offset);

        scope.object.lookAt(scope.target);

        if (scope.enableDamping === true) {
          sphericalDelta.theta *= 1 - scope.dampingFactor;
          sphericalDelta.phi *= 1 - scope.dampingFactor;

          panOffset.multiplyScalar(1 - scope.dampingFactor);
        } else {
          sphericalDelta.set(0, 0, 0);

          panOffset.set(0, 0, 0);
        }

        scale = 1;

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        return false;
      };
    })();

    this.dispose = () => {
      scope.domElement.removeEventListener('contextmenu', onContextMenu);

      scope.domElement.removeEventListener('pointerdown', onPointerDown);
      scope.domElement.removeEventListener('pointercancel', onPointerCancel);

      scope.domElement.removeEventListener('pointermove', onPointerMove);
      scope.domElement.removeEventListener('pointerup', onPointerUp);

      if (scope._domElementKeyEvents !== null) {
        scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
      }

      // scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
    };

    //
    // internals
    //

    let scale = 1;
    function getAutoRotationAngle() {
      return ((2 * Math.PI) / 60 / 60) * scope.autoRotateSpeed;
    }

    function rotateLeft(angle: number) {
      sphericalDelta.theta -= angle;
    }

    function rotateUp(angle: number) {
      sphericalDelta.phi -= angle;
    }

    const panLeft = (() => {
      const v = new Vector3();

      return function panLeft(distance: number, objectMatrix: Matrix4) {
        v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
        v.multiplyScalar(-distance);

        panOffset.add(v);
      };
    })();

    const panUp = (() => {
      const v = new Vector3();

      return function panUp(distance: number, objectMatrix: Matrix4) {
        if (scope.screenSpacePanning === true) {
          v.setFromMatrixColumn(objectMatrix, 1);
        } else {
          v.setFromMatrixColumn(objectMatrix, 0);
          v.crossVectors(scope.object.up, v);
        }

        v.multiplyScalar(distance);

        panOffset.add(v);
      };
    })();

    // deltaX and deltaY are in pixels; right and down are positive
    const pan = () => {
      const element = scope.domElement;
      const offset = new Vector3();

      return function pan(deltaX: number, deltaY: number) {
        // perspective
        const { position } = scope.object;
        offset.copy(position).sub(scope.target);
        let targetDistance = offset.length();

        // half of the fov is center to top of screen
        targetDistance *= Math.tan(((scope.object.fov / 2) * Math.PI) / 180.0);

        // we use only clientHeight here so aspect ratio does not distort speed
        panLeft(
          (2 * deltaX * targetDistance) / element.clientHeight,
          scope.object.matrix
        );
        panUp(
          (2 * deltaY * targetDistance) / element.clientHeight,
          scope.object.matrix
        );
      };
    };

    //
    // event callbacks - update the object state
    //

    function handleMouseDownRotate(event: {
      clientX: number;
      clientY: number;
    }) {
      rotateStart.set(event.clientX, event.clientY);
    }

    function handleMouseDownPan(event: { clientX: number; clientY: number }) {
      panStart.set(event.clientX, event.clientY);
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

    function handleMouseMovePan(event: { clientX: number; clientY: number }) {
      panEnd.set(event.clientX, event.clientY);

      panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);

      pan();

      panStart.copy(panEnd);

      scope.update();
    }

    function handleKeyDown(event: { code: any; preventDefault: () => void }) {
      let needsUpdate = false;

      switch (event.code) {
        case scope.keys.UP:
          pan();
          needsUpdate = true;
          break;

        case scope.keys.BOTTOM:
          pan();
          needsUpdate = true;
          break;

        case scope.keys.LEFT:
          pan();
          needsUpdate = true;
          break;

        case scope.keys.RIGHT:
          pan();
          needsUpdate = true;
          break;
      }

      if (needsUpdate) {
        // prevent the browser from scrolling on cursor keys
        event.preventDefault();

        scope.update();
      }
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

    function handleTouchStartPan() {
      if (pointers.length === 1) {
        panStart.set(pointers[0].pageX, pointers[0].pageY);
      } else {
        const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
        const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);

        panStart.set(x, y);
      }
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

    function handleTouchMovePan(event: PointerEvent) {
      if (pointers.length === 1) {
        panEnd.set(event.pageX, event.pageY);
      } else {
        const position = getSecondPointerPosition(event);

        const x = 0.5 * (event.pageX + position.x);
        const y = 0.5 * (event.pageY + position.y);

        panEnd.set(x, y);
      }

      panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);

      pan();

      panStart.copy(panEnd);
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

    function onPointerMove(event: { pointerType: string }) {
      if (scope.enabled === false) return;

      if (event.pointerType === 'touch') {
        onTouchMove(event);
      } else {
        onMouseMove(event);
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

    function onPointerCancel(event: any) {
      removePointer(event);
    }

    function onMouseDown(event: MouseEvent) {
      let mouseAction;

      switch (event.button) {
        case 0:
          mouseAction = scope.mouseButtons.LEFT;
          break;

        case 1:
          mouseAction = scope.mouseButtons.MIDDLE;
          break;

        case 2:
          mouseAction = scope.mouseButtons.RIGHT;
          break;

        default:
          mouseAction = -1;
      }

      switch (mouseAction) {
        case MOUSE.ROTATE:
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (scope.enablePan === false) return;

            handleMouseDownPan(event);

            state = STATE.PAN;
          } else {
            if (scope.enableRotate === false) return;

            handleMouseDownRotate(event);

            state = STATE.ROTATE;
          }

          break;

        case MOUSE.PAN:
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (scope.enableRotate === false) return;

            handleMouseDownRotate(event);

            state = STATE.ROTATE;
          } else {
            if (scope.enablePan === false) return;

            handleMouseDownPan(event);

            state = STATE.PAN;
          }

          break;

        default:
          state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.dispatchEvent(_startEvent);
      }
    }

    function onMouseMove(event: any) {
      if (scope.enabled === false) return;

      switch (state) {
        case STATE.ROTATE:
          if (scope.enableRotate === false) return;

          handleMouseMoveRotate(event);

          break;

        case STATE.PAN:
          if (scope.enablePan === false) return;

          handleMouseMovePan(event);

          break;
      }
    }

    function onKeyDown(event: any) {
      if (scope.enabled === false || scope.enablePan === false) return;

      handleKeyDown(event);
    }

    function onTouchStart(event: any) {
      trackPointer(event);

      switch (pointers.length) {
        case 1:
          switch (scope.touches.ONE) {
            case TOUCH.ROTATE:
              if (scope.enableRotate === false) return;

              handleTouchStartRotate();

              state = STATE.TOUCH_ROTATE;

              break;

            case TOUCH.PAN:
              if (scope.enablePan === false) return;

              handleTouchStartPan();

              state = STATE.TOUCH_PAN;

              break;

            default:
              state = STATE.NONE;
          }

          break;

        case 2:
          switch (scope.touches.TWO) {
            default:
              state = STATE.NONE;
          }

          break;

        default:
          state = STATE.NONE;
      }

      if (state !== STATE.NONE) {
        scope.dispatchEvent(_startEvent);
      }
    }

    function onTouchMove(event: any) {
      trackPointer(event);

      switch (state) {
        case STATE.TOUCH_ROTATE:
          if (scope.enableRotate === false) return;

          handleTouchMoveRotate(event);

          scope.update();

          break;

        case STATE.TOUCH_PAN:
          if (scope.enablePan === false) return;

          handleTouchMovePan(event);

          scope.update();

          break;

        default:
          state = STATE.NONE;
      }
    }

    function onContextMenu(event: { preventDefault: () => void }) {
      if (scope.enabled === false) return;

      event.preventDefault();
    }

    function addPointer(event: any) {
      pointers.push(event);
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

    scope.domElement.addEventListener('contextmenu', onContextMenu);

    scope.domElement.addEventListener('pointerdown', onPointerDown);
    scope.domElement.addEventListener('pointercancel', onPointerCancel);

    this.update();
  }

  update() {
    throw new Error('Method not implemented.');
  }
}

export { OrbitControls };
