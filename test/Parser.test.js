/*globals describe it */

require("should");
var Parser = require("../");

var testdata = [
	{
		name: "simple string",
		states: {
			"start": {
				"[d-gm-rv]+": function(match, index) {
					if(!this.data) this.data = [];
					this.data.push({
						match: match,
						index: index
					});
				}
			}
		},
		string: "abcdefghijklmnopqrstuvwxyz",
		expected: {
			data: [
				{ match: "defg", index: 3 },
				{ match: "mnopqr", index: 12 },
				{ match: "v", index: 21 }
			]
		}
	}
];

describe("Parser", function() {
	testdata.forEach(function(testcase) {
		it("should parse " + testcase.name, function() {
			var parser = new Parser(testcase.states);
			var actual = parser.parse("start", testcase.string, {});
			actual.should.be.eql(testcase.expected);
		});
	});
});
