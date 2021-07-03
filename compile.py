from os import listdir

result = ""

for script in listdir("dev"):
    with open(f"dev/{script}") as reading_file:
        result += f"/* {script} */\n\n"
        result += reading_file.read()
        result += "\n\n\n"

with open("main.js", "w") as out:
    out.write(result)