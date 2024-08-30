const staticReviews = [
  {
    rating: 5,
    relative_time_description: 'a year ago',
    text: 'Bought ceramic peranakan old style. Rare items hard to get. The owner is friendly. Bought for my melaka house.',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocJCNkOOCySIJa8dc4l6_nInzk7gEk3JiW9grO-1VgCWW82F8Q=s120-c-rp-mo-ba6-br100',
    author_name: 'M.azmir Bakar',
  },
  {
    rating: 5,
    relative_time_description: '4 years ago',
    text: 'A lot of choices for tiles and marble. Affordable price..',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ALV-UjXF49KlcKPSs3Yy0m8Kr5Q-C_nCnfR8MN6I1n00kNhe7MF0QHrKHg=s120-c-rp-mo-ba4-br100',
    author_name: 'MOHD YUSAIRI OTHMAN',
  },
  {
    rating: 3,
    relative_time_description: '4 years ago',
    text: 'A Good place to get your Floor Tiles here..... A lot of Selections available & very helpful staff to asist you all the way...',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocJvQnNQi805jvTQqvAwOoy0wDNva6ZagGFK7q_Knm2gJbHD3Q=s120-c-rp-mo-ba5-br100',
    author_name: 'Hj Zalizan',
  },
  {
    rating: 4,
    relative_time_description: '6 years ago',
    text: 'varieties of ceramic tiles with reasonable price for your budget.',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocJPLnORXzd1o_CPw41rhyjjPIT-gRjnzJ7GISK1xy-SGTZqtg=s120-c-rp-mo-ba5-br100',
    author_name: 'Ahmad Syahir',
  },
  {
    rating: 5,
    relative_time_description: '5 years ago',
    text: 'Highly recommended. Thanks to Mr Allen and Mr Beng for the excellent service. Keep it up👍',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocLv-02SqjQ5J3cNdKovrBSj9M8AbbRG-lmuQT6WOfeDB77yqA=s120-c-rp-mo-br100',
    author_name: 'Rasilah Ramli',
  },
  {
    rating: 5,
    relative_time_description: '8 years ago',
    text: 'Bought all interior home decor needs here. One stop shop.',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ALV-UjUXV2RDNizGDqcf8kTrMgFh_5PGLVtSwd8F2ffg00UMVckuV0O-5w=s120-c-rp-mo-br100',
    author_name: 'Faisal Zulhumadi',
  },
  {
    rating: 5,
    relative_time_description: '2 years ago',
    text: 'Good service, reasonable price and awesome showeoom',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ALV-UjWxc1zyp3Sj4By6C7MrbG7BPVxFsGnz672sQL1fDGxNBTlgIfXTcg=s120-c-rp-mo-ba2-br100',
    author_name: 'Lim Chun Woei',
  },
  {
    rating: 5,
    relative_time_description: '6 years ago',
    text: 'various choices; good customer relation; price reasonable',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ACg8ocKwpYAu5GdQONpRsFMsGPW7GithTBY0qH2rEgGhZ8yjV-kVKQ=s120-c-rp-mo-ba4-br100',
    author_name: 'Norm',
  },
]

export async function getReviews() {
  const engine = 'google_maps_reviews'
  const dataId = '0x304b57814b1f25b7%3A0x37d89c1c2cb83e9f'
  const hl = 'en'
  const apiKey = process.env.SERP_API_KEY

  if (!apiKey) {
    console.log('No API key found, using static reviews')
    return { type: 'testimonials', reviews: staticReviews }
  }

  const response = await fetch(
    `https://serpapi.com/search.json?engine=${engine}&data_id=${dataId}&hl=${hl}&api_key=${apiKey}`
  )
  const data = await response.json()
  const reviews = data.reviews.map((review) => {
    return {
      rating: review.rating,
      relative_time_description: review.date,
      text: review.snippet,
      profile_photo_url: review.user.thumbnail,
      author_name: review.user.name,
    }
  })

  return { type: 'testimonials', reviews }
}
