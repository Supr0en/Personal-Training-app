type Link = { href: string };

type CustomerLinks = {
  self: Link;
  customer: Link;
  trainings: Link;
};
type TrainingLinks = {
  self: Link,
  training: Link,
  customer: Link,
}

export type Customer = {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
  _links: CustomerLinks;
};

export type Training = {
  date: string,
  duration: number,
  activity: string,
  _links: TrainingLinks,
  details: {
    firstname: string,
    lastname: string,
  }
}
