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
	},
	{
		name: "state switing",
		states: {
			"number": {
				"([0-9]+)": function(match, number) {
					if(!this.data) this.data = {};
					this.data[this.ident] = +number;
					delete this.ident;
					return "start";
				},
				"-\\?": true,
				"\\?": "start"
			},
			"start": {
				"([a-z]+)": function(match, name) {
					this.ident = name;
					return "number";
				}
			}
		},
		string: "a 1 b 2 c f 3 d ? e -? 4",
		expected: {
			data: {
				a: 1, b: 2, c: 3, e: 4
			}
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

	it("should default context to empty object", function() {
		var parser = new Parser({
			"a": {
				"a": function() {
					this.should.be.eql({});
				}
			}
		});
		var result = parser.parse("a", "a");
		result.should.be.eql({});
	});
});
