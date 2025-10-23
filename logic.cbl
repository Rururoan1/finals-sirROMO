       IDENTIFICATION DIVISION.
       PROGRAM-ID. LOGIC.

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT INPUTFILE ASSIGN TO "data/input.json"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT OUTPUTFILE ASSIGN TO "data/output.dat"
               ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD  INPUTFILE.
       01  INPUT-REC PIC X(256).

       FD  OUTPUTFILE.
       01  OUTPUT-REC PIC X(256).

       WORKING-STORAGE SECTION.
       01  WS-LINE PIC X(256).

       PROCEDURE DIVISION.
           OPEN INPUT INPUTFILE
           OPEN OUTPUT OUTPUTFILE

           PERFORM UNTIL 1 = 2
               READ INPUTFILE INTO WS-LINE
                   AT END EXIT PERFORM
               END-READ
               STRING "Processed: " DELIMITED BY SIZE
                      WS-LINE DELIMITED BY SIZE
                      INTO OUTPUT-REC
               WRITE OUTPUT-REC
           END-PERFORM

           CLOSE INPUTFILE
           CLOSE OUTPUTFILE
           DISPLAY "COBOL processing complete."
           STOP RUN.
