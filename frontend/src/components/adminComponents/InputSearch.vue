<script>
export default {
  props: {
    modelValue: { type: String, default: "" },
  },
  emits: ["submit", "update:modelValue"],
  methods: {
    updateModelValue(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    submit() {
      this.$emit("submit");
    },
  },
};
</script>
<template>
  <div class="input-group">
    <input
      type="text"
      style="border: 1px solid #007bff"
      class="form-control"
      placeholder="Nhập thông tin cần tìm"
      :value="modelValue"
      @input="updateModelValue"
      @keyup.enter="submit"
    />
    <div class="input-group-append">
      <button
        class="btn btn-outline-primary"
        style="border: 1px solid #007bff"
        type="button"
        @click="submit"
      >
        <i class="fas fa-search"></i> Tìm kiếm
      </button>
    </div>
  </div>
</template>
