# Kasgai Survey
The survery system with CSV import.

## CSV Rules

### Definition
Write a element in one line. Parameters are split by ",". Param0 is a tag and it use following parameters.
```
<Tag>,<Id>,<Param1>,<Param2>,...,<ParamN>
```

### Introduction of Tags

#### section
A "section" tag shows large title.
> Definition
```
section,<Id>,<Title:Text>
```
> Example
```
section,section1,Please answer following questions.
```

#### text
A "text" tag shows a one-line text field.
> Definition
```
text,<Id>,<Question:Text>,<isRequired:Number>
```
> Example
```
text,name,What's your name?,1
```

#### longtext
A "longtext" tag shows a textarea.
> Definition
```
longtext,<Id>,<Question:Text>,<isRequired:Number>
```
> Example
```
longtext,idea,Write down your idea of future.,1
```

#### check
A "check" tag shows selection using checkboxes. It mainly used for multiple selection questions. You can show text field for "other", adding id= element at the end of the line. 
> Definition
```
check,<Id>,<Question:Text>,<isRequired:Number>,<choice0>,<choice1>,...,<choiceN>
check,<Id>,<Question:Text>,<isRequired:Number>,<choice0>,<choice1>,...,<other>
```
> Example
```
check,foods1,Which are your favarite foods?,0,Takoyaki,Humburgers,Cakes,Noodles
```
> Example
```
check,foods2,Which are your favarite foods?,0,Takoyaki,Humburgers,Cakes,Noodles,id=otherFood
```

#### radio
A "radio" tag shows selection using radio button. It mainly used for single selection questions. You can show text field for "other", adding id= element at the end of the line. 
> Definition
```
radio,<Id>,<Question:Text>,<isRequired:Number>,<choice0>,<choice1>,...,<choiceN>
radio,<Id>,<Question:Text>,<isRequired:Number>,<choice0>,<choice1>,...,<other>
```
> Example
```
radio,selectGender1,Select your gender.,1,male,female
```
> Example
```
radio,selectGender2,Select your gender.,1,male,female,id=otherGender
```
> Example
```
radio,selectGrade,Select your grade.,1,2,3,4,5,6,7
```

### Reserved Words
Following words are reserved words so you can't use these word as text. If you want to use these words, put "\\"(backslash) before it.
- id=
- ,

### Boolean Definition
- True : 1
- False : 0

### Other Rules
- Don't use same question title more than once because system use question title as id.
