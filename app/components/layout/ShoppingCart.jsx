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
  createStyles,
} from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconShoppingCart } from '@tabler/icons-react'
import { useState } from 'react'
import AcfirstSkeleton from '../common/AcfirstSkeleton'
import { useCart } from '../hooks/cart'
import DeleteCartItemBtn from '../common/DeleteCartItemBtn'

const useStyles = createStyles((theme) => ({
  link: {
    '&:hover': {
      color: theme.colors[theme.primaryColor][7],
    },
  },
}))

function CartItem({ product, index }) {
  const { classes } = useStyles()

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
            <Text
              component={Link}
              to={`/products/c/${product.code}`}
              className={classes.link}
            >
              {product.name}
            </Text>
            <Text color="dimmed">{product.category}</Text>
            <Text color="dimmed">Qty: {product.quantity}</Text>
          </Box>
          <DeleteCartItemBtn code={product.code} />
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
            <ScrollArea.Autosize mah={400} offsetScrollbars>
              {cartProducts}
            </ScrollArea.Autosize>
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
