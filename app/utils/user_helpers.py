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


def calculate_calories_per_day(gender, starting_weight_kg, height, age, goal, lbs_per_week):
    if gender == "Female":
        maintenance_calories = calculate_bmr_for_women(starting_weight_kg, height, age) + 600
    elif gender == "Male":
        maintenance_calories = calculate_bmr_for_men(starting_weight_kg, height, age) + 600

    if goal == "Maintain Weight":
        calories_per_day = maintenance_calories
    elif goal == "Lose Weight":
        calorie_deficit = (lbs_per_week * 3500) / 7
        calories_per_day = maintenance_calories - calorie_deficit
    elif goal == "Gain Weight":
        calorie_surplus = (lbs_per_week * 3500) / 7
        calories_per_day = maintenance_calories + calorie_surplus

    return calories_per_day
