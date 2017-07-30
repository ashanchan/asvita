export class PatientProfileModel {
  constructor(
    public profilePic: any = '',
    public fullName: string = '',
    public address1: string = '',
    public address2: string = '',
    public city: string = '',
    public pin: string = '',
    public state: string = '',
    public mobile: string = '',
    public sosPerson: string = '',
    public sosMobile: string = '',
    public dob: any = '',
    public gender: string = '',
    public salutation: string = '',
  ) { }
}