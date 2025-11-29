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
};

export type TrainingCustomerForm = {
  date: string,
  duration: number,
  activity: string,
  customer: string,
  _links: TrainingLinks,
};

export type TrainingFormWCustomer = Omit<TrainingCustomerForm, "_links">;
export type TrainingForm = Omit<Training, "_links">;
export type CustomerForm = Omit<Customer, "_links">;
