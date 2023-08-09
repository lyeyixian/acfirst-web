// TODO: deploy failed, cos healthcheck cant pass, probably becos of port error
export const loader = async ({ request }) => {
  try {
    const url = new URL(`http://localhost:${process.env.PORT ?? 3000}/`)
    // if we can make a HEAD request to ourselves, then we're good.
    await fetch(url.toString(), { method: 'HEAD' }).then((r) => {
      if (!r.ok) return Promise.reject(r)
    })
    return new Response('OK')
  } catch (error) {
    console.log('healthcheck ❌', { error })
    return new Response('ERROR', { status: 500 })
  }
}
