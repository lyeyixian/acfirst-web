<template>
  <div class="nav">
    <v-app-bar>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <template #extension>
        <v-tabs centered>
          <v-tab><NuxtLink to="/">Home</NuxtLink></v-tab>
          <v-tab><NuxtLink to="/about">About</NuxtLink></v-tab>
          <v-tab><NuxtLink to="/products">Products</NuxtLink></v-tab>
          <v-tab><NuxtLink to="/contact-us">Contact Us</NuxtLink></v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
