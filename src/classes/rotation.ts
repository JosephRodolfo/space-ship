
export class Rotation {

    constructor() {
        this.angle = 180;
        this.thrusterAngle = 180;
        this.angularAcceleration = 0;
        this.angularVelocity = 0;
    }


 

    angle: number;
    thrusterAngle: number;
    angularVelocity: number;
    angularAcceleration: number;


    // ...
    fireThruster(value: number) {
        this.angularAcceleration += value;

    }

    stopFiringThruster() {
        this.angularAcceleration = 0;
        // this.angularVelocity = 0;
    }

    calculateAngularVelocity(time: number) {
        this.angularVelocity += this.angularAcceleration * time;
    
        if (this.angularVelocity > 10) {
            this.angularVelocity = 10;
        } else if (this.angularVelocity < -10) {
            this.angularVelocity = -10;
        }
    }

    setAngleFromAngularVelocity(time: number) {
        const deltaAngle = this.angularVelocity * time;
    
        this.thrusterAngle += deltaAngle;
    
        if (this.thrusterAngle > 360) {
            this.thrusterAngle = 0;
        } else if (this.thrusterAngle < 0) {
            this.thrusterAngle = 360;
        }
    }

}
