from flask_login import current_user
from app.models import CardioLog

def verify_cardio_log(func):
    def wrapper(cardioLogId):
        cardio_log = CardioLog.query.get(cardioLogId)

        if not cardio_log:
            return {
                "errorMessage": "Sorry, Cardio Exercise Does Not Exist"
            }, 404

        if cardio_log.user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return func(cardio_log)

    return wrapper
