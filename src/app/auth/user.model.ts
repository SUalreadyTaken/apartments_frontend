export class UserC {
  // role: 'user',
  // _id: 5fa2b7500ad83a242d9860fa,
  // email: 'tester@test.com',
  // __v: 0
  public role: string;
  public id: string;
  public email: string;

  constructor(role: string, id: string, email: string) {
    this.role = role;
    this.id = id;
    this.email = email;
  }
}
