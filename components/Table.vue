<template>
  <div class="relative flex flex-col w-full h-full bg-white shadow-md rounded-lg">

    <form @submit.prevent="applySearch" class="p-4 flex gap-2">
      <input
          v-model="searchInput"
          type="text"
          placeholder="Search..."
          class="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
          type="submit"
          class="cursor-pointer transition-all
        bg-gray-700 text-white px-6 py-2 rounded-lg
        border-green-400
          border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
          active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-green-300 shadow-green-300 active:shadow-none"
      >
        Пошук
      </button>
      <button
          type="button"
          @click="clearSearch"
          v-if="searchQuery"
          class="cursor-pointer transition-all
        bg-gray-700 text-white px-6 py-2 rounded-lg
        border-red-400
          border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
          active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-green-300 shadow-green-300 active:shadow-none"
      >
        Очистити
      </button>
    </form>

    <table class="w-full text-left table-auto">
      <thead>
      <tr>
        <th
            v-for="header in headers"
            :key="header.key"
            class="p-3 text-xs font-medium text-slate-600 border-b border-slate-200 bg-slate-50"
            :class="header.key === 'description' ? 'w-[360px]' : ''"
        >
          <button @click="sortBy(header.key)" class="flex items-center">
            {{ header.title }}
            <svg
                v-if="sortKey === header.key"
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 h-3 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="sortAsc ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"
              />
            </svg>
          </button>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-slate-50">
        <td class="p-3 border-b border-slate-200">
          <p class="text-xs font-medium text-slate-800 max-w-[120px]">
            {{ product.title }}
          </p>
        </td>
        <td class="p-3 border-b border-slate-200 w-[360px]">
          <p class="text-xs text-slate-600 max-w-[340px]">
            {{ product.description }}
          </p>
        </td>
        <td class="p-3 border-b border-slate-200">
          <p class="text-xs font-medium text-slate-800">
            ${{ product.price }}
          </p>
        </td>
        <td class="p-3 border-b border-slate-200">
          <p class="text-xs font-medium" :class="product.rating < 4.5 ? 'text-red-500' : 'text-green-500'">
            {{ product.rating }}
          </p>
        </td>
        <td class="p-3 border-b border-slate-200">
          <p class="text-xs text-slate-800 max-w-[80px]">
            {{ product.brand }}
          </p>
        </td>
        <td class="p-3 border-b border-slate-200">
          <p class="text-xs text-slate-800 capitalize max-w-[80px]">
            {{ product.category }}
          </p>
        </td>
        <td class="p-3 border-b border-slate-200">
          <img
              :src="product.thumbnail"
              :alt="product.title"
              class="w-[100px] h-[100px] object-cover rounded border border-slate-200"
              loading="lazy"
          >
        </td>
      </tr>
      </tbody>
    </table>

    <div class="flex justify-center items-center gap-2 p-4">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
              class="px-3 py-1 text-sm bg-slate-200 rounded hover:bg-slate-400 disabled:opacity-50">
        Previous
      </button>
      <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm bg-slate-200 rounded hover:bg-slate-400 disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { data: apiData } = await useFetch('https://dummyjson.com/products')
const products = ref(apiData.value.products)

const searchInput = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 10
const sortKey = ref('')
const sortAsc = ref(true)

const headers = [
  { key: 'title', title: 'Title' },
  { key: 'description', title: 'Description' },
  { key: 'price', title: 'Price' },
  { key: 'rating', title: 'Rating' },
  { key: 'brand', title: 'Brand' },
  { key: 'category', title: 'Category' },
  { key: 'thumbnail', title: '' }
]

function applySearch() {
  searchQuery.value = searchInput.value.trim()
  currentPage.value = 1
}

function clearSearch() {
  searchInput.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(p =>
      Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  )
})

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedProducts = computed(() => {
  if (!sortKey.value) return filteredProducts.value

  return [...filteredProducts.value].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]

    if (typeof valA === 'string') {
      return sortAsc.value
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
    } else {
      return sortAsc.value ? valA - valB : valB - valA
    }
  })
})

const totalPages = computed(() =>
    Math.ceil(sortedProducts.value.length / perPage)
)

const paginatedProducts = computed(() =>
    sortedProducts.value.slice(
        (currentPage.value - 1) * perPage,
        currentPage.value * perPage
    )
)

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>
