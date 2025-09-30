import { useAuthService } from "@/services/auth.service";
export default {
  name: "RegisterPage",
  setup() {
    const { register } = useAuthService();
    return { register };
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confPassword: "",
      contact: "",
      errors: {},
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      this.errors.name = !this.name
        ? "Name is required"
        : /\d/.test(this.name)
        ? "Name cannot contain numbers"
        : this.name.length > 25
        ? "Max 25 characters allowed"
        : "";
      this.errors.email = !this.email
        ? "Email is required"
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
        ? ""
        : "Enter valid email";
      this.errors.password = !this.password
        ? "Password is required"
        : /\s/.test(this.password)
        ? "Password cannot contain spaces"
        : "";
      this.errors.confPassword =
        this.confPassword === this.password ? "" : "Passwords do not match";
      this.errors.contact =
        this.contact === "" || /^\d{10}$/.test(this.contact)
          ? ""
          : "Contact must have exactly 10 digits";
      return Object.values(this.errors).every((err) => !err);
    },
    async registerUser() {
      if (!this.validateForm()) {
        console.info("Form validation failed", this.errors);
        return;
      }
      try {
        const { data } = await this.register(
          this.name,
          this.email,
          this.password,
          this.contact
        );
        if (data && data.register && data.register.id) {
          console.info(
            `Registration successful for user: ${data.register.email}`
          );
          this.$router.push("/login");
        } else {
          console.warn(
            "Registration failed: Invalid response from server.",
            data
          );
        }
      } catch (error) {
        console.error("Registration error:", error);
      }
    },
  },
};
