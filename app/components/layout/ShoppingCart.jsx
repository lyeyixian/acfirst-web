import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Indicator,
  Paper,
  Popover,
  ScrollArea,
  Text,
} from '@mantine/core'
import { Link, useFetcher, useRouteLoaderData } from '@remix-run/react'
import { IconShoppingCart, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import AcfirstSkeleton from '../common/AcfirstSkeleton'
import { useCart } from '../hooks/cart'

function CartItem({ product, index }) {
  const deleteCartItemBtn = useFetcher()

  return (
    <div>
      {index !== 0 && <Divider my="md" />}
      <Paper>
        <Group noWrap>
          <AcfirstSkeleton>
            {(handleOnLoad, imageRef) => (
              <Image
                imageRef={imageRef}
                src={product.imgUrl}
                maw={75}
                radius="sm"
                onLoad={handleOnLoad}
              />
            )}
          </AcfirstSkeleton>
          <Box
            mr="md"
            miw={100}
            sx={{
              flexGrow: 1,
            }}
          >
            <Text>{product.name}</Text>
            <Text color="dimmed">{product.category}</Text>
            <Text color="dimmed">Qty: {product.quantity}</Text>
          </Box>
          <deleteCartItemBtn.Form method="delete" action="/cart">
            <input type="hidden" name="code" value={product.code} />
            <ActionIcon
              color="red.4"
              type="submit"
              loading={deleteCartItemBtn.state === 'submitting'}
            >
              <IconTrash size="1.2rem" />
            </ActionIcon>
          </deleteCartItemBtn.Form>
        </Group>
      </Paper>
    </div>
  )
}

export default function ShoppingCart() {
  const { cartItems } = useCart()
  const [cartOpened, setCartOpened] = useState(false)

  const cartProducts = cartItems.map((product, index) => (
    <CartItem key={index} product={product} index={index} />
  ))

  return (
    <Popover shadow="sm" opened={cartOpened} onChange={setCartOpened}>
      <Popover.Target>
        <Indicator color="red" label={cartItems.length} size={16}>
          <ActionIcon variant="subtle" onClick={() => setCartOpened((o) => !o)}>
            <IconShoppingCart stroke={1.5} size="2rem" />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown p="xl">
        {cartProducts.length ? (
          <>
            <ScrollArea mah={400} offsetScrollbars>
              {cartProducts}
            </ScrollArea>
            <Button
              fullWidth
              mt="xl"
              component={Link}
              to="/checkout"
              onClick={() => setCartOpened(false)}
            >
              Checkout
            </Button>
          </>
        ) : (
          <>
            <Text align="center" size="sm" color="dimmed">
              Your cart is empty.
            </Text>
            <Button
              fullWidth
              mt="xl"
              component={Link}
              to="/products"
              onClick={() => setCartOpened(false)}
            >
              Browse our products
            </Button>
          </>
        )}
      </Popover.Dropdown>
    </Popover>
  )
}
