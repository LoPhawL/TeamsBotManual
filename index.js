const { json } = require('express');
const app = require('express')();
app.use(json())
const { TeamsActivityHandler, CardFactory, TurnContext} = require("botbuilder");

class TeamsBot extends  TeamsActivityHandler{
    constructor(){
        super();

        this.onMessage(async (context, next) => {
            console.log("Running with Message Activity.");
            let txt = context.activity.text;
            const removedMentionText = TurnContext.removeRecipientMention(
              context.activity
            );
            if (removedMentionText) {
              // Remove the line break
              txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
            }
      
            if (txt === 'hi') {
              await context.sendActivity("Hello there.. how are you doing?")
            }
            else if(txt.includes('+')){
              const inps = txt.split('+')
              await context.sendActivity( String(+inps[0] + +inps[1]) )
            }
            else if(txt.includes('-')){
              const inps = txt.split('-')
              await context.sendActivity( String(+inps[0] - +inps[1]) )
            }
            else{
              await context.sendActivity("Delighted to meet you. Up for a coffee?")
            }
            await next();
          });
    }
}

const { BotFrameworkAdapter } = require("botbuilder");
const bot = new TeamsBot();

const adapter = new BotFrameworkAdapter({
    appId: '3c615e6e-bbc9-4ae4-9bc4-865b851dcf21', //bot id
    appPassword: '52b7Q~uSg-P4l6iAcVrf~o8v1onlqF~yzxLnU',//bot pwd (client secret generated from teams dev portal)
  });

app.post('/api/messages', async (req, res, next)=>{
    await adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
      });
})

app.get('/knockKnock', async (req, res, next)=>{
  res.status(200).send({message:"Who is it?"})
})

app.listen(1212, ()=>{
    console.log('started');
})