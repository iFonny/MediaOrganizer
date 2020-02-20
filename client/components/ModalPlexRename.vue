<template>
  <div class="modal-card" style="width: auto;">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ name }}</p>
    </header>
    <section class="modal-card-body">
      <div class="content">
        <p><strong>Old name: </strong> {{ name }}</p>
        <p>
          <strong>Full path: </strong> <em> {{ fullPath }} </em>
        </p>

        <b-field label="New name">
          <b-input v-model="renameNewName" placeholder="Serie (YEAR) | Film (YEAR) (LANG) (UHD)" required expanded />
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-success" expanded :disabled="buttonLoading || !renameNewName" :loading="buttonLoading" @click.prevent="rename">
        Rename
      </b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    fullPath: {
      type: String,
      required: true
    }
  },

  data() {
    return { buttonLoading: false, renameNewName: this.name }
  },

  methods: {
    async rename() {
      this.buttonLoading = true

      try {
        await this.$axios.$post('/files/rename', { filepath: this.fullPath, newName: this.renameNewName.trim() })
        this.$emit('refresh')
        this.$parent.close()
        this.$buefy.toast.open('File renamed!')
      } catch (error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: `Error: can't rename file`,
          position: 'is-top',
          type: 'is-danger',
          hasIcon: true
        })
        console.error(error)
      }

      this.buttonLoading = false
    }
  }
}
</script>
