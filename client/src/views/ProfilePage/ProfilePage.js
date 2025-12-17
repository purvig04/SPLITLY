import {
  CLOUDINARY_BASE_URL,
  uploadAvatar,
} from "@/services/cloudinary.service";
import { getInitials } from "@/utils/stringHelpers";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ProfilePage",

  data() {
    return {
      profileData: {
        name: "",
        email: "",
        contact: "",
        profilePic: "",
        profilePicVersion: "",
        createdAt: "",
        updatedAt: "",
      },
      originalData: {},

      previewProfileUrl: null,

      isEditing: {
        name: false,
        contact: false,
      },

      loadingText: "Updating profile...",

      errors: {
        name: "",
        contact: "",
      },

      saving: false,
      photoFile: null,
      version: null,

      splitwiseCode: "SPLIT-XYZ-12345",
      codeCopied: false,
    };
  },

  /* -------------------- COMPUTED -------------------- */
  computed: {
    ...mapGetters("auth", ["getUser"]),

    user() {
      return this.getUser;
    },

    hasChanges() {
      return (
        this.profileData.name?.trim() !== this.originalData.name?.trim() ||
        this.profileData.contact?.trim() !==
          this.originalData.contact?.trim() ||
        this.photoFile !== null
      );
    },

    formattedCreatedAt() {
      if (!this.profileData.createdAt) return null;
      return new Date(parseInt(this.profileData.createdAt)).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    },

    profileUrl() {
      if (this.previewProfileUrl) {
        return this.previewProfileUrl; // 👈 temporary preview
      }

      if (!this.profileData.profilePic) {
        return null; // or default avatar
      }

      return (
        CLOUDINARY_BASE_URL +
        ("v" + this.profileData.profilePicVersion + "/") +
        this.profileData.profilePic
      );
    },
  },

  methods: {
    ...mapActions("auth", ["updateUserProfile", "fetchUser"]),

    getInitials,

    loadProfileData() {
      if (!this.user) return;

      const {
        name = "",
        email = "",
        contact = "",
        profilePic = "",
        profilePicVersion = "",
        createdAt = new Date().toISOString(),
        updatedAt = "",
      } = this.user;

      this.profileData = {
        name,
        email,
        contact,
        profilePic,
        profilePicVersion,
        createdAt,
        updatedAt,
      };
      this.originalData = { ...this.profileData };
    },

    resetChanges() {
      this.profileData = { ...this.originalData };
      this.photoFile = null;
      this.previewProfileUrl = null;
      this.isEditing = { name: false, contact: false };
      this.errors = { name: "", contact: "" };
      this.$refs.fileInput && (this.$refs.fileInput.value = "");
    },

    enableEdit(field) {
      this.isEditing[field] = true;
      this.$nextTick(() => {
        const input = this.$el.querySelector(
          `input[type="${field === "contact" ? "tel" : "text"}"]`
        );
        input && !input.disabled && input.focus();
      });
    },

    validateField(field) {
      this.errors[field] = "";

      if (field === "name") {
        const value = this.profileData.name?.trim();
        if (!value) return (this.errors.name = "Name is required"), false;
        if (value.length < 2)
          return (
            (this.errors.name = "Name must be at least 2 characters"), false
          );
      }

      if (field === "contact" && this.profileData.contact?.trim()) {
        const regex = /^[6-9]\d{9}$/;
        if (!regex.test(this.profileData.contact))
          return (
            (this.errors.contact =
              "Please enter a valid 10-digit contact number"),
            false
          );
      }

      return true;
    },

    saveField(field) {
      this.validateField(field) && (this.isEditing[field] = false);
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handlePhotoChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/"))
        return alert("Please select an image file");
      if (file.size > 5 * 1024 * 1024)
        return alert("File size should not exceed 5MB");

      this.photoFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewProfileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async buildUpdatePayload() {
      const payload = {};

      if (this.profileData.name?.trim() !== this.originalData.name?.trim()) {
        payload.name = this.profileData.name?.trim();
      }

      if (
        this.profileData.contact?.trim() !== this.originalData.contact?.trim()
      ) {
        payload.contact = this.profileData.contact?.trim();
      }

      if (this.photoFile) {
        const { public_id, version } = await uploadAvatar(this.photoFile);
        payload.profilePic = public_id;
        // console.log("secure:", secure_url);
        // console.log("version:", version, typeof version);
        payload.profilePicVersion = version.toString();
      }

      return payload;
    },

    async saveProfile() {
      if (!this.hasChanges) return;

      if (!this.validateField("name") || !this.validateField("contact")) return;

      this.saving = true;

      try {
        const payload = await this.buildUpdatePayload();
        if (!Object.keys(payload).length) return;

        // console.log("PP User Before:", this.profileUrl);

        this.loadingText = "Saving Changes...";
        await this.updateUserProfile(payload);
        this.previewProfileUrl = null;

        this.loadProfileData();
        // console.log("PP User After:", this.profileUrl);

        this.photoFile = null;
      } catch (err) {
        console.error(err);
        alert("Failed to update profile. Please try again.");
      } finally {
        this.saving = false;
      }
    },

    async copyCode() {
      await navigator.clipboard.writeText(this.splitwiseCode);
      this.codeCopied = true;
      setTimeout(() => (this.codeCopied = false), 2000);
    },

    goBack() {
      this.$router.go(-1);
    },
  },

  async mounted() {
    await this.fetchUser();
    this.loadProfileData();
    // console.log(this.profileUrl);
  },
};
