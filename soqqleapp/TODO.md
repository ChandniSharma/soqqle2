# TODO

1) These components located at `src/views` need to update their lifecycle methods according to latest React guidelines

      * ProfileView.js
      * SparkView.js
      * TaskView.js
      * ChatView.js
      * UserTaskGroupView.js
      * AchievemntView.js
      * LoginView.ios.js
      * UserList.js
      * CompanyView.js
      * StoryView.js
      * AgendaView.js
      * RewardsView.js
  
2) Look at `soqqleapp/src/views/AchievementView.js Comments`

    > fetchUserAchievements is an async method? Because we are asking the length of achievements in next line instead of inside a callback. - Abait Esteban

3) About `import { SAVE_TASK_PATH_API, UPDATE_USER_TASK_GROUP_API_PATH ... }` in `ChatView`

    > Would be nice to extract data access logic like this requests to API from the View logic - Abait Esteban

4) About `this.socket = SocketIOClient` in `ChatView`

    > This socket io initialization would be better suited to be an action thunk (redux-thunk) or a saga (redux-saga) - Abait Esteban

5) On `LoginView.android.js` (`linkedinLogin`, `facebookLogin`, etc...)

    > This methods should be removed from View logic and define them as action thunks - Abait Esteban
 
6) On `StoryView.js` (`_renderItem`)

    > Is there a way to split this render component into smaller ones? - Abait Esteban