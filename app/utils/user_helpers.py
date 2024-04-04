from datetime import datetime
def calculate_bmr_for_women(weight_kg, height_cm, age_years):
    bmr = 655 + (9.6 * weight_kg) + (1.8 * height_cm) - (4.7 * age_years)
    return int(bmr)

def calculate_bmr_for_men(weight_kg, height_cm, age_years):
    bmr = 66 + (13.7 * weight_kg) + (5 * height_cm) - (6.8 * age_years)
    return int(bmr)


def calculate_age(date_of_birth):
    today = datetime.now().date()
    date_object = datetime.strptime(date_of_birth, "%Y-%m-%d")
    age = today.year - date_object.year - ((today.month, today.day) < (date_object.month, date_object.day))

    return age

def convert_height_to_cm(feet, inches):
    total_inches = feet * 12 + inches
    height_in_cm = total_inches * 2.54

    return height_in_cm
