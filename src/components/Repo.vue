<template>
  <div class="repo container">
	<div class="add-repo">
		Search by Name and Date: <input type="text" v-model="filterRepo"/>
	</div>
	</br>
	<div class="add-repo">
		<input type="text" v-model="addRepo"/> <Button @click="doAddRepo(addRepo)">Add new repo</Button>
	</div>
	</br>
	<div class="edit-repo">
		Change name of Repo : <b>{{selectedRepo}}</b> <input type="text" v-model="editRepo"/> <Button @click="doEditRepo(selectedRepo, editRepo)">Change Name</Button>
	</div>
	</br>
    <table class="table table-striped">
		<thead>
		  <tr>
		    <th></th>
			<th v-for="item in headerTitles" @click="sortBy(item.key)">{{item.title}}</th>
			<th></th>
		  </tr>
		</thead>
		<tbody>
		  <tr v-for="(repo, index) in filteredRepos">
			<td><input type="radio" :id="repo.id" :value="repo.name" v-model="selectedRepo"></td>
			<td>{{repo.id}}</td>
			<td>{{repo.name}}</td>
			<td>{{repo.created_at}}</td>
			<td><Button @click="doRemoveRepo(repo.name, index)">Delete Repo</Button></td>
		  </tr>
		</tbody>
	</table>
  </div>
</template>

<script>
export default {
  name: 'repo',
  data () {
    return {
      userName: 'caothuylinh',
      accessToken: '0230243d987f28542e110e67f77f6984405070eb',
      headerTitles: [
        {
          title: 'id',
          key: 'id'
        },
        {
          title: 'Repo name',
          key: 'name'
        },
        {
          title: 'Created At',
          key: 'created_at'
        }
      ],
      repos: [],
      filterRepo: '',
      lastKey: '',
      lastOrder: 1,
      addRepo: '',
      editRepo: '',
      selectedRepo: ''
    }
  },
  methods: {
    loadApiRepo: function () {
      this.$http.get('https://api.github.com/user/repos?access_token=' + this.accessToken)
        .then(function (response) {
          this.reloadRepo(response.data)
          console.log(response.data)
        })
    },
    loadApiRepoWithSorted: function () {
      this.$http.get('https://api.github.com/user/repos?access_token=' + this.accessToken + '&sort=push')
        .then(function (response) {
          this.reloadRepo(response.body)
        })
      // this.repos.sort ('created_at')
    },
    reloadRepo: function (data) {
      this.repos = data
    },
    changeNameRepo: function (oldName, newName) {
      this.repos.forEach(function (item) {
        if (item.name === oldName) {
          item.name = newName
          return
        }
      })
    },
    sort: function (data, order) {
      this.repos.sort(function (a, b) {
        return a[data] > b[data] ? 1 * order : -1 * order
      })
    },
    sortBy: function (data) {
      var order = 1
      if (data === this.lastKey) {
        order = -this.lastOrder
      }
      this.lastKey = data
      this.lastOrder = order
      this.sort(data, order)
    },
    doAddRepo: function (data) {
      this.$http.post('https://api.github.com/user/repos?access_token=' + this.accessToken, {
        'name': data
      }).then(function (response) {
        this.repos.push(response.body)
      })
    },
    doRemoveRepo: function (data, index) {
      this.$http.delete('https://api.github.com/repos/' + this.userName + '/' + data + '?access_token=' + this.accessToken)
        .then(function (response) {
          console.log(response)
          this.repos.splice(index, 1)
        })
    },
    doEditRepo: function (selectedRepo, newRepo) {
      this.$http.patch('https://api.github.com/repos/' + this.userName + '/' + selectedRepo.trim() + '?access_token=' + this.accessToken, {
        'name': newRepo.trim()
      }).then(function (response) {
        console.log(selectedRepo.id)
        this.changeNameRepo(selectedRepo, newRepo)
      })
    }
  },
  computed: {
    // A computed property that holds only those articles that match the searchString.
    filteredRepos: function () {
      var reposArray, filterRepo
      reposArray = this.repos
      filterRepo = this.filterRepo
      if (!filterRepo) {
        return reposArray
      }
      filterRepo = filterRepo.trim().toLowerCase()
      reposArray = reposArray.filter(function (item) {
        if (item.name.toLowerCase().indexOf(filterRepo) !== -1 || item.created_at.toLowerCase().indexOf(filterRepo) !== -1) {
          return item
        }
      })
      // Return an array with the filtered data.
      return reposArray
    }
  },
  created: function () {
    this.loadApiRepo()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

th {
  text-align: center;
}
a {
  color: #42b983;
}
</style>
