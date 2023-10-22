const reviews = [
  {
    author_name: 'M.azmir Bakar',
    author_url:
      'https://www.google.com/maps/contrib/117051616429797800063/reviews',
    language: 'en',
    original_language: 'en',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocJH8168aYUUl0YuZTpBc0mGDmotImiUdyhf3jReFimE=s128-c0x00000000-cc-rp-mo-ba6',
    rating: 5,
    relative_time_description: '5 months ago',
    text: 'Bought ceramic peranakan old style. Rare items hard to get. The owner is friendly. Bought for my melaka house.',
    time: 1683721487,
    translated: false,
  },
  {
    author_name: 'MOHD YUSAIRI OTHMAN',
    author_url:
      'https://www.google.com/maps/contrib/101332127114886547977/reviews',
    language: 'en',
    original_language: 'en',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ALV-UjX2yVSgy_ovUXbYPJwhViYzodA7qLrcy19B5jqqh9_10a2v=s128-c0x00000000-cc-rp-mo-ba4',
    rating: 5,
    relative_time_description: '3 years ago',
    text: 'A lot of choices for tiles and marble. Affordable price..',
    time: 1591520678,
    translated: false,
  },
  {
    author_name: 'Yuzz Volper',
    author_url:
      'https://www.google.com/maps/contrib/113667695590585934364/reviews',
    language: 'en',
    original_language: 'en',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ALV-UjVk-hZcNl5rouIbeWBem7jP4XRH4dmIVrBx-O9jZQVpzLU=s128-c0x00000000-cc-rp-mo-ba4',
    rating: 4,
    relative_time_description: '5 months ago',
    text: 'Good shop',
    time: 1684543759,
    translated: false,
  },
  {
    author_name: 'Hj Zalizan',
    author_url:
      'https://www.google.com/maps/contrib/101862515971678032632/reviews',
    language: 'en',
    original_language: 'en',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocI18Ahx8eQwdDThKLPYr0FC0RQclrwrsdJ4nMluG86K=s128-c0x00000000-cc-rp-mo-ba5',
    rating: 3,
    relative_time_description: '4 years ago',
    text: 'A Good place to get your Floor Tiles here..... A lot of Selections available & very helpful staff to asist you all the way...',
    time: 1570591398,
    translated: false,
  },
  {
    author_name: 'Rasilah Ramli',
    author_url:
      'https://www.google.com/maps/contrib/116513802225997206772/reviews',
    language: 'en',
    original_language: 'en',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocKwXkwSADQQK0perl3RksJ11NJRL3USw3SKzOzFPmTE=s128-c0x00000000-cc-rp-mo',
    rating: 5,
    relative_time_description: '4 years ago',
    text: 'Highly recommended. Thanks to Mr Allen and Mr Beng for the excellent service. Keep it up👍',
    time: 1551330712,
    translated: false,
  },
]

// TODO: testimonials
// https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJtyUfS4FXSzARnz64LByc2Dc&fields=reviews&key=AIzaSyC_zEcyP8I-qHW7PibdGEWycO3HE7xkr3g

export async function getReviews() {
  return { type: 'testimonials', reviews }
}
