import {
  Anchor,
  Avatar,
  Box,
  Center,
  Group,
  Paper,
  Rating,
  SimpleGrid,
  Text,
  rem,
} from '@mantine/core'
import SectionContainer from './SectionContainer'

function Testimonial({
  profilePicUrl,
  authorName,
  relativeTimeDescription,
  text,
  rating,
}) {
  return (
    <Paper withBorder shadow="xs" p="md" mb="md">
      <Group>
        <Avatar src={profilePicUrl} alt={authorName} radius="xl" />
        <div>
          <Text weight={600} size="sm">
            {authorName}
          </Text>
          <Group spacing={8}>
            <Rating value={rating} fractions={2} readOnly size="xs" />
            <Text size="xs" c="dimmed">
              {relativeTimeDescription}
            </Text>
          </Group>
        </div>
      </Group>
      <Text mt={4} pl={54} size="sm">
        {text}
      </Text>
    </Paper>
  )
}

export default function TestimonialsSection({ reviews }) {
  const testimonials = reviews.map((review, index) => (
    <Testimonial
      key={index}
      profilePicUrl={review.profile_photo_url}
      authorName={review.author_name}
      relativeTimeDescription={review.relative_time_description}
      text={review.text}
      rating={review.rating}
    />
  ))

  return (
    <SectionContainer title="Testimonials" subtitle="What our customers say">
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 'sm', cols: 1, verticalSpacing: rem(8) }]}
      >
        {testimonials}
      </SimpleGrid>
      <Center mt="lg">
        <Anchor
          href="https://www.google.com/search?q=acfirst+ceramics+sdn.+bhd&oq=acfirst+ceram&aqs=edge.0.0i512j69i57j0i512j0i22i30j69i60l3j69i64.3161j0j1&sourceid=chrome&ie=UTF-8#ip=1&lrd=0x304b57814b1f25b7:0x37d89c1c2cb83e9f,1,,,,"
          target="_blank"
          rel="noreferrer noopener"
        >
          See More ...
        </Anchor>
      </Center>
    </SectionContainer>
  )
}
