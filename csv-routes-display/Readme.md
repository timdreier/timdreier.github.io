# CSV route display
I wrote this little tool to display the Routes IBM ILOG CPLEX Optimization Studio when solving the VRP's that I deal with in my bachelor thesis.
It Accepts a two dimensional JSON-Array of Routes, or the CPLEX output e.g.:
`{<{0 2}> <{0 4 1}> <{0 5}> <{0 6}> <{0 8 7 3}>}`
The Nodes have to be in the Format Name;lat;long;demand, e.g.:
`Stuttgarter Straße 17;48.398453;10.873910;0`

The tool loads the csv used in my bachelor thesis by default. The CSV can be adapted or exchanged in the right textbox.