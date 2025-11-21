type Link = { href: string };

type CustomerLinks = {
  self: Link;
  customer: Link;
  trainings: Link;
};

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

