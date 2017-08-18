export class DoctorProfileModel {
  constructor(
    public mode: string = '',
    public userId: string = '',
    public profileUrl: string = '',
    public fullName: string = '',
    public mobile: string = '',
    public clinic: Array<string> = [],
    public address: Array<string> = [],
    public city: Array<string> = [],
    public pin: Array<string> = [],
    public state: Array<string> = [],
    public contact: Array<string> = [],
    public openTime: Array<number> = [],
    public endTime: Array<number> = [],
    public openDay: Array<string> = [],
    public qualification: string = '',
    public specialization: Array<string> = [],
    public specializationOther: string = ''
  ) { }
}