
##Deprecated
 This repo is no more in development. Please Use [GreinerHorman](https://github.com/w8r/GreinerHormann) that is nicely implemented and well documented. 

##About this repo
Vatti polygon clipping algorithm implementation to perform polygon boolean operations union, intersection, difference and XOR.

Though this repository can be used for academic purpose.

### so far work done

* works for self intersecting polygons and polygons with holes.
* works for multipolygon in subject or clip
**TODO**
* Still remaining part is handling of horizontal edges and operations union and difference. To extend it for union and difference only vertex classification rules need to be changed.
* More test data need to be incorporated.
* To implement the vatti algo I have used doubly circular linked list. I found one [module](https://github.com/cweill/Sorted-Circular-Doubly-Linked-List), but I had to modified it a lot.  I am looking for robust implementation for sorted doubly linked list.
* Performance test.

There is a [test page](https://github.com/gagan-bansal/polygon-clipper/blob/master/examples/polygon-clipper-test.html) on map interface.

**Why did I deprecate**

Greiner Hormann algorithm seems better approach than Vatti algorithm, as Vatti algo is based on so many logical conditions so implementation is not that easy. And there is an [implementation of GreinerHormann](https://github.com/w8r/GreinerHormann) that seems to be very nicely implemented and documented.
