export class RecordModel {
    constructor(
        public patientId: string = '',
        public doctorId: string = '',
        public recordDate: string = '',
        public referred: string = '',
        public weight: string = '',
        public temprature: string = '',
        public bp: string = '',
        public pulse: string = '',
        public diagnosis: string = '',
        public invAdvised: string = '',
        public followUp: string = '',
        public notes: string = '',
        public medicine: Array<string> = [],
        public bbf: Array<string> = [],
        public abf: Array<string> = [],
        public bl: Array<string> = [],
        public al: Array<string> = [],
        public eve: Array<string> = [],
        public bd: Array<number> = [],
        public ad: Array<number> = [],
        public day: Array<string> = []
    ) { }
}