import {
  Avatar,
  Box,
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
  return (
    <SectionContainer title="Testimonials" subtitle="What our customers say">
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 'sm', cols: 1, verticalSpacing: rem(8) }]}
      >
        {reviews.map((review) => (
          <Testimonial
            key={review.id}
            profilePicUrl={review.profile_photo_url}
            authorName={review.author_name}
            relativeTimeDescription={review.relative_time_description}
            text={review.text}
            rating={review.rating}
          />
        ))}
      </SimpleGrid>
    </SectionContainer>
  )
}
