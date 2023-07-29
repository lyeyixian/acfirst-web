import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { AspectRatio, Image, Text, Title } from '@mantine/core'
import { getPageBySlug } from '../../models/page.server'
import { getStrapiMedia } from '../../utils/apiHelper'

export async function loader() {
  const pageData = await getPageBySlug('about')
  const imgUrl = getStrapiMedia(pageData.attributes.contentSection[0].url.data)
  const texts = []

  for (let i = 1; i < pageData.attributes.contentSection.length; i++) {
    const { title, description } = pageData.attributes.contentSection[i]

    texts.push({ title, descriptions: description.split('\n\n') })
  }
  return json({ imgUrl, texts })
}

export default function AboutIndexRoute() {
  const loaderData = useLoaderData()
  const { imgUrl, texts } = loaderData
  const content = texts.map((data, index) => {
    const { title, descriptions } = data

    return (
      <div key={index}>
        <Title order={2} mb="xs" mt="lg">
          {title}
        </Title>
        {descriptions.map((description, index) => (
          <Text key={index} mb="sm">
            {description}
          </Text>
        ))}
      </div>
    )
  })
  // TODO: add skeleton to image
  return (
    <div>
      <AspectRatio ratio={21 / 9}>
        <Image src={imgUrl} radius="sm" />
      </AspectRatio>
      {content}
    </div>
  )
}
