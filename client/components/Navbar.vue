<template>
  <section>
    <b-navbar type="is-dark">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <h1 class="title has-text-white">Plex</h1>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Waiting
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/moving' }">
          Moving
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/plex-series' }">
          Plex Series
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/plex-films' }">
          Plex Films
        </b-navbar-item>
      </template>
    </b-navbar>
  </section>
</template>
