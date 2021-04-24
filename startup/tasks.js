const {scheduleJob} = require('node-schedule');
const { ActiveUsersModel } = require('../models/active-users');

module.exports = function() {

    global.tasks.userMaintainance = scheduleJob('*/5 * * * * *', async function(params) {

        try{
            const InActiveUsers = await ActiveUsersModel.aggregate([
                {
                    '$project': { 'inActiveTime': {'$trunc': {'$divide': [{ '$subtract': [ new Date(), '$lastAccessed' ] }, 1000 ]} }, _id: 1 }
                },
                {
                    '$match': {"inActiveTime": {'$gt': global.sessionValidityInSecs*2 } }
                },
                {
                    '$project': {'_id': 1}
                }
            ]);

            InActiveUsers.forEach( function(record){
                ActiveUsersModel.findOneAndRemove(record, function(err){
                    if(err)
                    {
                        console.log(err);
                    }
                });
            });

        }catch(err){
            console.log(err);
        }
    });

}