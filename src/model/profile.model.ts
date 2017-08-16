export class ProfileModel {
  constructor(
    public profilePic: any = '',
    public fullName: string = '',
    public mobile: Array<string> = [],
    public gender: string = '',
    public salutation: string = '',
    public address: Array<string> = [],
    public city: Array<string> = [],
    public pin: Array<string> = [],
    public state: Array<string> = [],
    public sosPerson: string = '',
    public sosMobile: string = '',
    public dob: string = '',
    public weight: string = '',
    public medicalHistory: Array<string> = [],
    public medicalHistoryOther: string = '',
    public allergy: string = '',

    public clinic: Array<string> = [],
    public openTime: Array<number> = [],
    public endTime: Array<number> = [],
    public openDay: Array<string> = [],
    public specialization: Array<string> = [],
    public specializationOther: string = ''
  ) { }
}