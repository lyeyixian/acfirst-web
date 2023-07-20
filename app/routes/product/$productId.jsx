import {
  Accordion,
  Button,
  Divider,
  Grid,
  Image,
  List,
  ScrollArea,
  Tabs,
  Text,
  Title,
} from '@mantine/core'
import { useParams } from '@remix-run/react'
import CardsCarousel from '../../components/CardsCarousel'

export default function ProductRoute() {
  const params = useParams()

  return (
    <div>
      <h1>Product {params.productId}</h1>
      <Grid>
        <Grid.Col span={6}>
          <Tabs defaultValue="1" variant="pills" inverted>
            <Tabs.Panel value="1">
              <Image
                src="https://i.imgur.com/ZL52Q2D.png"
                alt="Tesla Model S"
              />
            </Tabs.Panel>
            <Tabs.Panel value="2">
              <Image
                src="https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
                alt="Tesla Model S"
              />
            </Tabs.Panel>
            <Tabs.Panel value="3">
              <Image
                src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                alt="Tesla Model S"
              />
            </Tabs.Panel>
            <Tabs.Panel value="4">
              <Image
                src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                alt="Tesla Model S"
              />
            </Tabs.Panel>
            <Tabs.Panel value="5">
              <Image
                src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                alt="Tesla Model S"
              />
            </Tabs.Panel>

            <ScrollArea w="26rem" offsetScrollbars>
              <Tabs.List w={700}>
                <Tabs.Tab value="1">
                  <Image
                    height={50}
                    src="https://i.imgur.com/ZL52Q2D.png"
                    alt="Tesla Model S"
                  />
                </Tabs.Tab>
                <Tabs.Tab value="2">
                  <Image
                    height={50}
                    src="https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
                    alt="Tesla Model S"
                  />
                </Tabs.Tab>
                <Tabs.Tab value="3">
                  <Image
                    height={50}
                    src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                    alt="Tesla Model S"
                  />
                </Tabs.Tab>
                <Tabs.Tab value="4">
                  <Image
                    height={50}
                    src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                    alt="Tesla Model S"
                  />
                </Tabs.Tab>
                <Tabs.Tab value="5">
                  <Image
                    height={50}
                    src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                    alt="Tesla Model S"
                  />
                </Tabs.Tab>
              </Tabs.List>
            </ScrollArea>
          </Tabs>
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={2}>Tesla Model S</Title>
          <Text>Place: Kitchen</Text>
          <Text>Surface: Kitchen</Text>
          <Text>Category: Wall Tiles</Text>
          <Text>Size: 300x300</Text>
          <Button>Add to Cart</Button>
          <Accordion variant="contained" multiple>
            <Accordion.Item value="specification">
              <Accordion.Control>Specification</Accordion.Control>
              <Accordion.Panel>
                <List>
                  <List.Item>Glazed Ceramic Tiles</List.Item>
                  <List.Item>Fix Pattern</List.Item>
                  <List.Item>Thickness 7.8mm</List.Item>
                  <List.Item>Rectified</List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="feautre">
              <Accordion.Control>Feature</Accordion.Control>
              <Accordion.Panel>
                <List>
                  <List.Item>Glazed Ceramic Tiles</List.Item>
                  <List.Item>Fix Pattern</List.Item>
                  <List.Item>Thickness 7.8mm</List.Item>
                  <List.Item>Rectified</List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Grid.Col>
      </Grid>
      <Divider my="md" />
      <Title order={3}>Related Products</Title>
      <CardsCarousel
        products={[
          {
            code: 'BS3305',
            category: 'kitchen',
            name: 'Tile 1',
            viewCount: 100,
            imgUrl: 'http://localhost:1337/uploads/BS_3303_bd7040947f.jpg',
          },
        ]}
      />
    </div>
  )
}
