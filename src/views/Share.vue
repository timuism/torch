<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import html2canvas from 'html2canvas'
import type { Ref } from 'vue'

const { newWorkout } = storeToRefs(useAppStore())
const $workout = newWorkout.value

// @todo: move defaultUnit into global state
const defaultUnit = ('lbs')
const imageGenerated = ref(false)
const workoutContainer = ref(null)
const capture:Ref<HTMLDivElement | null> = ref(null)
const showSaveImageModal = ref(false) 

function copyRawTextToClipboard(event: Event) {
  const { raw } = $workout
  let isCopied = false
  navigator.clipboard.writeText(raw).then(() => {
    isCopied = true
    alert("✅ Workout Copied!")
  })

  return isCopied
}

function generateImageFromWorkoutData(event: Event) {
  const { raw } = $workout
  let isCopied = false
  navigator.clipboard.writeText(raw).then(() => {
    isCopied = true

    html2canvas(capture.value as HTMLDivElement).then(canvas => {
      let img = canvas.toDataURL("image/png")
      document.write(`<img src="${img}" alt="Your captured workout summary" />`)
    })
  })

  return isCopied
}
</script>

<template>
  <div class="px-12 pt-12 font-sans">
    <h2 class="mb-12 text-2xl font-semibold text-purple-700 font-display">Workout Completed and Captured! ⚡️</h2>

    <dl class="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-12">
      <div>
        <dt class="text-[10px] font-bold tracking-widest text-purple-300 uppercase mb-2">Workout</dt>
        <dd class="pl-2 text-lg text-purple-700 border-l-4 border-purple-100 border-dotted font-display">{{ $workout.wtitle ? $workout.wtitle : 'Untitled' }}</dd>
      </div>

      <div>
        <dt class="text-[10px] font-bold tracking-widest text-purple-300 uppercase mb-2">Date</dt>
        <dd class="pl-2 text-lg text-purple-700 border-l-4 border-purple-100 border-dotted font-display">
          {{ $workout.wdate }}
        </dd>
      </div>
    </dl>

    <div v-if="$workout.exercises.length > 0" class="mt-12">
      <p class="text-[10px] font-bold tracking-widest text-purple-300 uppercase mb-2">Exercises</p>
      <div class="pl-4 border-l-4 border-purple-100 border-dotted">
        <div v-for="(exercise, index) in $workout.exercises" :key="index" class="mb-6">
          <div class="mb-2 mr-6 text-xl font-normal text-left text-purple-700 capitalize font-display">
            <p>{{ exercise.name }}</p>
          </div>
          <div class="-ml-1.5">
            <p v-for="(set, index) in exercise.sets" :key="index" class="inline-flex mx-1.5 my-1 text-gray-800 bg-yellow-50 border border-yellow-300 rounded-sm">
              <span class="p-1 font-mono text-xs text-yellow-700"><strong class="mr-0.5">{{ set.reps }}</strong>Reps</span>  
              <span 
                v-if="set.weight"
                class="p-1 font-mono text-xs text-yellow-700 bg-yellow-100"
              >
                <strong class="mr-0.5">{{ set.weight[0] }}</strong>{{ set.weight[1] ?? defaultUnit }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div ref="capture"></div>

  <div class="flex flex-col justify-center w-full px-4 pt-6 mt-12 mb-4 space-y-4 border-t-2 border-purple-200 md:space-y-0 md:space-x-4 md:flex-row">
    <PrimaryButton @click="showSaveImageModal = true">
      Share as an Image
    </PrimaryButton>
    <button
      type="button"
      @click="copyRawTextToClipboard"
      class="px-4 py-4 text-purple-600 duration-150 bg-transparent border-2 border-transparent rounded-md hover:border-transparent hover:bg-green-600 hover:text-green-50 font-display"
    >
      Copy Text to Clipboard
    </button>
  </div>

  <div>

    <!-- <button
      type="button"
      @click=""
      class="px-4 py-4 text-purple-600 duration-150 bg-transparent border-2 border-transparent rounded-md hover:border-transparent hover:bg-green-600 hover:text-green-50 font-display"
    >
      Capture another workout
    </button> -->

    <!-- <button
      type="button"
      @click=""
      class="px-4 py-4 text-purple-600 duration-150 bg-transparent border-2 border-transparent rounded-md hover:border-transparent hover:bg-green-600 hover:text-green-50 font-display"
    >
      View All Workouts
    </button> -->

    <Teleport to="body">
      <div v-if="showSaveImageModal" class="fixed top-0 left-0 z-10 flex justify-center w-screen h-screen py-12 md:py-0 item-start md:items-center bg-purple-900/75 backdrop-blur-sm">
        <div class="w-11/12 p-12 overflow-y-auto bg-white rounded h-11/12 md:h-auto md:w-2/3">
          <div class="grid grid-rows-2 grid-col-1 md:grid-cols-2 md:grid-rows-1">
          <div ref="capture" class="border-4 border-purple-200 p-12 mt-6 bg-gradient-to-t from-purple-700 via-purple-900 to-yellow-900 rounded-lg aspect-[9/16] max-h-[720px] mx-auto">
            <dl class="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-12">
              <div>
                <h4 class="text-lg font-semibold text-white font-display">{{ $workout.wtitle ? $workout.wtitle : 'Untitled' }}</h4>
                <p class="text-sm tracking-wide text-purple-300 font-display">
                  {{ $workout.wdate }}
                </p>
                <p class="flex items-center mt-4 font-sans text-[10px] font-semibold tracking-widest text-pink-100 uppercase rounded">Captured by Torch</p>
              </div>
            </dl>

            <div v-if="$workout.exercises.length > 0" class="mt-6">
              <div class="">
                <div v-for="(exercise, index) in $workout.exercises" :key="index" class="mb-3">
                  <div class="mb-1 mr-6 text-base font-normal text-left text-white capitalize font-display">
                    <p>{{ exercise.name }}</p>
                  </div>
                  <div class="flex flex-col border-l-2 border-purple-600 border-dotted">
                    <p v-for="(set, index) in exercise.sets" :key="index" class="inline-flex items-center mx-1.5 text-gray-800 ">
                      <span class="p-0.5 font-mono text-xs text-yellow-200"><strong class="mr-0.5">{{ set.reps }}</strong>Reps</span>
                      <span 
                        v-if="set.weight"
                        class="p-1 font-mono text-xs text-yellow-100"
                      >
                        <strong class="mr-0.5">@{{ set.weight[0] }}</strong>{{ set.weight[1] ?? defaultUnit }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div class="pt-12">
              <h3 class="pb-6 text-xl font-semibold text-purple-700">Share on Instagram Stories</h3>
              <div class="flex flex-col space-y-4">
                <PrimaryButton @click="generateImageFromWorkoutData">
                  Save as an Image
                </PrimaryButton>
                
                <PrimaryButton @click="showSaveImageModal = false">
                  Close Modal
                </PrimaryButton>
              </div>
            </div>
          </div>     
        </div>
      </div>
    </Teleport>
  </div>
</template>