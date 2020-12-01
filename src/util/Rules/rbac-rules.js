const rules = {
  "statndard-user": {
    static: ["home-page:visit"],
    dynamic: {},
  },
  admin: {
    static: [
      "users:get",
      "users:create",
      "users:modify",
      "users:delete",
      "users:getSelf",
      "kiosks:get",
      "kiosks:create",
      "kiosks:modify",
      "kiosks:delete",
      "home-page:visit",
      "dashboard-page:visit",
    ],
  },
};

export default rules;
