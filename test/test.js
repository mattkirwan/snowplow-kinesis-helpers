const rewire = require("rewire")
const helpers = rewire("../index")

const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const expect = chai.expect;
chai.should()

const sinon = require("sinon")

describe("Module", () => {

    it("should return a function", done => {
        helpers.snowplowTransformBase64EncodedRecord.should.be.a("function")

        done()
    })

})

describe("#snowplowTransformBase64EncodedRecord()", () => {

    it("should resolve with a valid encoded snowplow event object", () => {
        let event = require("./fixtures.json")

        return helpers.snowplowTransformBase64EncodedRecord(event.Records[1].kinesis.data).should.be.fulfilled
    })

    it("should resolve the correct transformed snowplow event object", () => {
        let event = require("./fixtures.json")

        return helpers.snowplowTransformBase64EncodedRecord(event.Records[0].kinesis.data).should.eventually.have.property("dvce_sent_tstamp", "2019-04-10T15:14:31.376Z")
    })

    it("should reject if provided with an invalid snowplow event object", () => {
        let invalidBase64EncodedSnowplowRecord = Buffer.from(JSON.stringify({Invalid:"SnowPlowEventObject"})).toString("base64")
        
        return helpers.snowplowTransformBase64EncodedRecord(invalidBase64EncodedSnowplowRecord).should.be.rejectedWith("Wrong event fields number.")
    })

    it("should call the snowplow transform function exactly once", () => {
        let event = require("./fixtures.json")

        let spy = sinon.spy(helpers.__get__("transform"))
        helpers.__set__("transform", spy)
    
        helpers.snowplowTransformBase64EncodedRecord(event.Records[0].kinesis.data)

        return expect(spy.calledOnce).to.equal(true)        
    })

    it("should call the snowplow transform function with a base64 decoded snowplow event string", () => {
        let event = require("./fixtures.json")

        let spy = sinon.spy(helpers.__get__("transform"))
        helpers.__set__("transform", spy)
    
        helpers.snowplowTransformBase64EncodedRecord(event.Records[0].kinesis.data)

        let assertion = '43760b91-bb2f-4715-8233-3c982e07e389\tweb\t2019-04-10 15:14:33.869\t2019-04-10 15:14:31.939\t2019-04-10 15:14:31.376\tpage_view\t87e405f1-800b-4036-9d52-e9d4fde06de5\t\tthrift\tjs-2.9.2\tssc-0.15.0-kinesis\tstream-enrich-0.19.1-common-0.35.0\t\t224f49883223e6728721d4f83cbb24ec1b5e68d2b2461f5f98b4210aed06688e\te185471d3a3e5dc9fe9cde5bebc18137561ae3db7abe77425871e58cc3fd2d35\tdf48383e-a1c0-4a1a-865d-220e0dec3973\t1\t669f86af-0436-4997-b13a-e098ce70d90d\tUS\tCA\tLos Angeles\t90014\t34.0494\t-118.2641\tCalifornia\t\t\t\t\thttps://www.example.com/\tExample Website\t\thttps\twww.example.com\t443\t/\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tMozilla/5.0 (X11; Fedora; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0\tFirefox\tFirefox\t66.0\tBrowser\tGECKO\ten-GB\t0\t1\t0\t0\t0\t0\t0\t0\t0\t\t24\t1920\t564\tLinux\tLinux\tOther\tEurope/London\tComputer\t0\t1920\t1080\tUTF-8\t1920\t564\t\t\t\t\t\t\tGBP\tAmerica/Los_Angeles\t\t\t\t2019-04-10 15:14:31.376\t\t\t{"schema":"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1","data":[{"schema":"iglu:com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0","data":{"useragentFamily":"Firefox","useragentMajor":"66","useragentMinor":"0","useragentPatch":null,"useragentVersion":"Firefox 66.0","osFamily":"Fedora","osMajor":null,"osMinor":null,"osPatch":null,"osPatchMinor":null,"osVersion":"Fedora","deviceFamily":"Other"}},{"schema":"iglu:org.ietf/http_cookie/jsonschema/1-0-0","data":{"name":"sp","value":"669f86af-0436-4997-b13a-e098ce70d90d"}}]}\t476d9a88-5441-4031-9927-3f62d20055e7\t2019-04-10 15:14:31.939\tcom.snowplowanalytics.snowplow\tpage_view\tjsonschema\t1-0-0\te94f509202e708f7f2821d0d900f1caf\t'

        return expect(spy.calledWith(assertion)).to.equal(true)    
    })

})
