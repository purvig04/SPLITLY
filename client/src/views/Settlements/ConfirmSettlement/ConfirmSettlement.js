import { settlementService } from "@/services/settlements.service";
// import { checkAndSettleGroup } from "@/utils/settlements";
import { mapGetters } from "vuex";


export default {
  name: "ConfirmSettlement",
  props: {
    selectedUser: Object,
    group: Object,
  },
  data() {
    return {
      settlement:{}
    };
  },
   computed: {
    ...mapGetters("auth", ["getUser"]),
    user() {
      return this.getUser;
    },
  },
  methods: {
    getUserName(id) {
      const user = this.group.members.find((p) => p.user.id === id);
      return user.user.name;
    },
    async confirmSettlement() {
      let payerId="";
      let receiverId="";
      if(this.selectedUser.type==="owed"){
          payerId = this.selectedUser.person;
          receiverId = this.user.id;
      }else{
         payerId = this.user.id;
         receiverId = this.selectedUser.person;
      }
  
      const input = {
        group_id: this.group.id,
        payer_id: payerId, // YOU are paying
        receiver_id: receiverId, // Person receiving
        amount: Number(this.selectedUser.amount),
      };

      const { createSettlement } = await settlementService.createSettlement(input);
      this.$emit('settlement',createSettlement)
      this.$emit('close')
      // await checkAndSettleGroup(this.group.id,this.group.members);
      
    },
  },
  mounted() {
    console.log("slected user", this.selectedUser);
  },
};


