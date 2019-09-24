exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("gallery")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("gallery").insert([
        {
          user_id: 1,
          url: "https://placekitten.com/g/300/300",
          // user_id: 1,
          description: "something about a pic"
        },
        {
          user_id: 2,
          url: "https://placekitten.com/g/300/400",
          // user_id: 1,
          description: "something about a pic"
        },
        {
          user_id: 1,
          url: "https://placekitten.com/g/400/300",
          // user_id: 1,
          description: "something about a pic"
        }
      ]);
    });
};
