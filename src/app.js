const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

function actionMW({ payload, context, say, next, ack }) {
  // This middleware is invoked with type: 'block_actions',
  console.log('MW ------->', payload);
  next();
}

app.use(actionMW);

// Listens to incoming messages that contain "hello"
app.message('hi', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say({
    blocks: [
	    {
		    "type": "section",
        "text": {
          "type": "plain_text",
          "text": `Hey there <@{message.user}!`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me"
          },
          "action_id": "button_click"
		    }
	    }
    ]
  });
});

app.action('button_click', ({ action, say }) => {
  say(`@{action.user} clicked the button`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
