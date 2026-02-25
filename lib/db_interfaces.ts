export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface MosaicItem {
  image: string;
  title: string;
  subtitle: string;
  link: string;
  buttonText: string;
}

export interface InfoCard {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export interface StoreItem {
  id: string;
  title: string;
  badge: string;
  address: string;
  phone: string;
  image?: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface BulletinItem {
  id: string;
  date: string;
  time: string;
  country: string;
  event: string;
  importance: 1 | 2 | 3;
  impact: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface UiConfig {
  heroSlides: HeroSlide[];
  collectionMosaic: {
    mainTitle: string;
    description: string;
    items: MosaicItem[];
  };
  infoCenter: {
    title: string;
    subtitle: string;
    cards: InfoCard[];
  };
  showcase: {
    title: string;
    description: string;
    productIds: string[];
  };
  storeSection: {
    title: string;
    subtitle: string;
    stores: StoreItem[];
  };
  footer: {
    description: string;
    copyrightText: string;
    socialMedia: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
    corporateLinks: FooterLink[];
    customerServiceLinks: FooterLink[];
  };
  bulletins?: BulletinItem[];
}
