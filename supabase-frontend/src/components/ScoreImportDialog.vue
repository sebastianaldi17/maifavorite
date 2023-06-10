<template>
    <v-dialog v-model="dialogVisible" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Dialog Title</span>
            </v-card-title>
            <v-card-text>
                <div>Insert score data here:</div>
                <v-textarea v-model="textValue" label="Text" rows="4" outlined></v-textarea>
                <p class="text-red">{{ errorMessage }}</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" @click="importScores">Import scores</v-btn>
                <v-btn color="red" @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            errorMessage: "",
            textValue: "",
        }
    },
    emits: ['triggerModal'],
    methods: {
        closeDialog() {
            this.$emit('triggerModal', false)
            this.dialogVisible = false
        },
        importScores() {
            try {
                let parsed = JSON.parse(this.textValue)
                for(let i = 0 ; i < parsed.length; i += 1) {
                    if(parsed[i].length !== 2) {
                        this.errorMessage = "Invalid score data: score object is not of length 2"
                        return
                    }
                    
                    if(typeof parsed[i][0] !== "number") {
                        this.errorMessage = "Invalid score data: chart ID is not number"
                        return
                    }

                    if(typeof parsed[i][1] !== "string") {
                        this.errorMessage = "Invalid score data: score is not string"
                        return
                    }
                }
                localStorage.setItem("scores", this.textValue)
                window.location.reload()
            } catch (err) {
                console.error(err)
                this.errorMessage = "Invalid score data: " + err
                return
            }
        }
    }
}
</script>