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
        public medicine: any = []
    ) { }
}