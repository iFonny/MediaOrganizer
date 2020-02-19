<template>
  <section>
    <b-navbar type="is-dark">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <h1 class="title has-text-white">Plex</h1>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item :to="{ path: '/jdownloader' }">
          Jdownloader
        </b-navbar-item>
        <b-navbar-item :to="{ path: '/moving' }">
          Moving
        </b-navbar-item>
      </template>
    </b-navbar>
    <br />
  </section>
</template>
