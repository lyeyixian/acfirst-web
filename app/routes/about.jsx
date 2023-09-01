import { useLoaderData } from '@remix-run/react'
import { getPage } from '../models/page.server'
import { getStrapiMedia } from '../utils/apiHelper'
import { json } from '@remix-run/node'
import { AspectRatio, Image, Skeleton, Text, Title } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useSkeletonLoading } from '../components/hooks/skeleton'

export async function loader() {
  const pageData = await getPage('about')
  const imgUrl = getStrapiMedia(pageData.attributes.contentSection[0].url.data)
  const texts = []

  for (let i = 1; i < pageData.attributes.contentSection.length; i++) {
    const { title, description } = pageData.attributes.contentSection[i]

    texts.push({ title, descriptions: description.split('\n\n') })
  }
  return json({ imgUrl, texts })
}

export default function About() {
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

  const imageRef = useRef(null)
  const { loading, handleOnLoad } = useSkeletonLoading(imageRef)

  return (
    <div>
      <h1>About Acfirst</h1>
      <AspectRatio ratio={21 / 9}>
        <Skeleton visible={loading}>
          <Image
            imageRef={imageRef}
            onLoad={handleOnLoad}
            src={imgUrl}
            radius="sm"
          />
        </Skeleton>
      </AspectRatio>
      {content}
    </div>
  )
}
