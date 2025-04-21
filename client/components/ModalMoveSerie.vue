<template>
  <div class="modal-card" style="width: auto; min-width: 58vw;min-height: 95vh;">
    <header class="modal-card-head">
      <p class="modal-card-title"><strong>Move</strong> {{ name }}</p>
    </header>
    <section class="modal-card-body">
      <b-steps v-model="activeStep" :has-navigation="false">
        <b-step-item label="Series" icon="television">
          <article class="panel">
            <p class="panel-heading">Select a serie</p>

            <a class="panel-block" @click.prevent="selectSerie('')">
              <span class="panel-icon"> <i class="mdi mdi-plus-circle-outline mdi-24px" aria-hidden="true" /> </span>&nbsp;
              <span>Ajouter une nouvelle serie</span>
            </a>

            <div class="panel-block">
              <b-input v-model="searchQuery" placeholder="Search..." type="search" icon="magnify" icon-clickable> </b-input>
            </div>

            <a v-for="serie of filteredSeries" :key="serie.fullPath" class="panel-block" @click.prevent="selectSerie(serie.name)">{{ serie.name }}</a>
          </article>
        </b-step-item>

        <b-step-item label="Move" icon="folder-move">
          <b-field label="Serie *">
            <b-input v-model="moveEpisodeForm.serie" placeholder="Serie (YEAR)" required expanded />
          </b-field>

          <b-field label="Season *">
            <b-numberinput v-model="moveEpisodeForm.season" min="0" max="999" required expanded />
          </b-field>

          <b-field label="Episode *">
            <b-numberinput v-model="moveEpisodeForm.episode" min="0" max="999" required expanded />
          </b-field>

          <b-field label="Lang *">
            <b-select v-model="moveEpisodeForm.lang" placeholder="Lang" icon="earth" required expanded>
              <option value="VF">VF</option>
              <option value="VO">VO</option>
              <option value="VOST">VOST</option>
              <option value="VOSTFR">VOSTFR</option>
              <option value="MULTI">MULTI</option>
            </b-select>
          </b-field>

          <p>
            <strong>Full path: </strong> <em> {{ moveEpisodeForm.filepath }} </em>
          </p>

          <br />

          <b-field>
            <div class="columns">
              <div class="column">
                <b-field>
                  <b-checkbox v-model="moveEpisodeForm.overwrite" type="is-danger">Overwrite</b-checkbox>
                </b-field>
                <b-field>
                  <b-checkbox v-model="moveEpisodeForm.shouldFormatName" type="is-info">Rename file (formatted)</b-checkbox>
                </b-field>
              </div>
              <div class="column">
                <b-button type="is-dark" expanded @click.prevent="activeStep -= 1">Back</b-button>
              </div>
              <div class="column">
                <b-button type="is-success" :disabled="!isMoveEpisodeFormFieldsValid" :loading="buttonLoading" expanded @click.prevent="moveEpisode">
                  Move
                </b-button>
              </div>
            </div>
          </b-field>
        </b-step-item>
      </b-steps>
    </section>
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
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    extension: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    numbersOfFiles: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      activeStep: 0,
      allSeries: [],
      searchQuery: '',
      buttonLoading: false,
      moveEpisodeForm: {
        filepath: this.fullPath,
        serie: null,
        season: null,
        episode: null,
        lang: null,
        overwrite: false
      }
    }
  },

  computed: {
    filteredSeries() {
      return this.allSeries.filter(e => e.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    },

    isMoveEpisodeFormFieldsValid() {
      return (
        !this.buttonLoading &&
        this.moveEpisodeForm.filepath &&
        this.moveEpisodeForm.serie &&
        this.moveEpisodeForm.season >= 0 &&
        this.moveEpisodeForm.episode >= 0 &&
        this.moveEpisodeForm.lang
      )
    }
  },

  async beforeMount() {
    try {
      const { serie } = await this.$axios.$get('/series/get-episode-info', { params: { filename: this.fullPath } })
      if (serie) this.searchQuery = serie

      this.allSeries = await this.$axios.$get('/series/list')
    } catch (error) {
      console.log(error)
    }
  },

  methods: {
    async selectSerie(serieName) {
      try {
        const episodeInfo = await this.$axios.$get('/series/get-episode-info', { params: { filename: this.fullPath } })

        this.moveEpisodeForm.serie = serieName
        this.moveEpisodeForm.season = episodeInfo.season
        this.moveEpisodeForm.episode = episodeInfo.episode
        this.moveEpisodeForm.lang = episodeInfo.lang
      } catch (error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: `Error: can't get episode info`,
          position: 'is-top',
          type: 'is-danger',
          hasIcon: true
        })
        console.error(error)
      }

      this.activeStep += 1
    },

    async moveEpisode() {
      this.buttonLoading = true

      try {
        await this.$axios.$post('/series/move', this.moveEpisodeForm)
        this.$emit('refresh')
        this.$parent.close()
      } catch (error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: error.response ? `Error: ${error.response.data.message}` : `Error: can't move episode (unknown)`,
          position: 'is-top',
          type: 'is-danger',
          hasIcon: true
        })
        console.error(error.response.data)
      }

      this.buttonLoading = false
    }
  }
}
</script>
