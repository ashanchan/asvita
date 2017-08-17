export class PatientProfileModel {
    constructor(
        public mode: string = '',
        public userId: string = '',
        public profileUrl: string = '',
        public fullName: string = '',
        public mobile: string = '',
        public gender: string = '',
        public salutation: string = '',
        public address: Array<string> = [],
        public city: Array<string> = [],
        public pin: Array<string> = [],
        public state: Array<string> = [],
        public sosPerson: string = '',
        public sosMobile: string = '',
        public dob: string = '',
        public height: string = '',
        public weight: string = '',
        public medicalHistory: Array<string> = [],
        public medicalHistoryOther: string = '',
        public allergy: string = ''
    ) { }
}