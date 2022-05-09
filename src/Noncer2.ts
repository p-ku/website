import { v4 } from 'uuid';

const myNonce = v4();
(window as any).litNonce = myNonce;
